
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
     username: {
        type: String, required: true
    },
     email: {
        type: String, required: true
    },
     phone: {
        type: String, required: true
    },
     password: {
        type: String, required: true
    },
     role: {
        type: String, enum:["User", "Volunteer", "Admin"],
        default: "User"
    },
    isAvailable: {
    type: Boolean,
    default: true,
    },
     bio: {
        type: String, default: ""
    },
     imageUrl: {
        type: String, default: ""
    },
    location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      required: function () {
        return this.role === "Volunteer";
      },
    }
  }
},
{ timestamps: true}
);

//Geo index for location
userSchema.index({ location: "2dsphere"});
module.exports = mongoose.model("User", userSchema);
