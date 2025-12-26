import Package from "../models/Package.js";
import fs from "fs"; // File system to delete images if package is deleted

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({});
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPackage = async (req, res) => {
  try {
    const { name, price, duration, type, startLocation, stopLocation, transport } = req.body;
    
    // Validating that an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const newPackage = new Package({
      name,
      price,
      duration,
      type,
      startLocation,
      stopLocation,
      transport,
      image: `/${req.file.path.replace(/\\/g, "/")}`, // Store path with forward slashes
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a package (Admin)
// @route   DELETE /api/packages/:id
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (pkg) {

      await Package.deleteOne({ _id: req.params.id });
      res.json({ message: "Package removed" });
    } else {
      res.status(404).json({ message: "Package not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { name, price, duration, type, startLocation, stopLocation, transport } = req.body;
    const pkg = await Package.findById(req.params.id);

    if (pkg) {
      pkg.name = name || pkg.name;
      pkg.price = price || pkg.price;
      pkg.duration = duration || pkg.duration;
      pkg.type = type || pkg.type;
      pkg.startLocation = startLocation || pkg.startLocation;
      pkg.stopLocation = stopLocation || pkg.stopLocation;
      pkg.transport = transport || pkg.transport;
      
      // If a new image is uploaded, update it
      if (req.file) {
        pkg.image = `/${req.file.path.replace(/\\/g, "/")}`;
      }

      const updatedPackage = await pkg.save();
      res.json(updatedPackage);
    } else {
      res.status(404).json({ message: "Package not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};