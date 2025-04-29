import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../Model/User.Model.js";
import Product from "../Model/Product.Model.js";

// REGISTER CONTROLLER
export const userRegisterController = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  try {
    // Validate the request body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send response with token
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN CONTROLLER
export const userLoginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getWishlistController = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully',
      data: user.wishlist,
    });
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const addToWishlistController = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    console.log(userId, productId); 

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);

    // Check if already in wishlist (by product name)
    const alreadyExists = user.wishlist.some(item => item.productName === product.productName);
    if (alreadyExists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add product name + link
    user.wishlist.push({
      productName: product.productName,
      productLink: product.productLink,
    });

    await user.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const removeFromWishlistController = async (req, res) => {
  try {
    const { productId } = req.params; // Get wishlist item ID
    const userId = req.user.id;
    console.log(userId, productId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = user.wishlist.filter(item => item._id.toString() !== productId);
    await user.save();

    res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Remove Wishlist Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
