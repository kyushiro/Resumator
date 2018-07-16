var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SkillSchema = new Schema({
    skill_name: {
        type: String,
        required: true
    },
    skill_level: {
        type: Number,
        required: true
    }
});

var WorkExpSchema = new Schema({
    position : {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required:false
    },
    date_started: {
        type: Date,
        required: true
    },
    date_ended: {
        type: Date,
        required: false
    }
});

var ResumeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
  },
  full_name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: false
  },
  date_submitted: {
      type: Date,
      required: false
  },
  skills: [SkillSchema],
  work_experience: [WorkExpSchema]
});

module.exports = mongoose.model('Resume', ResumeSchema);