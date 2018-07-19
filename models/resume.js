var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CertificationSchema = new Schema({
  certification_name: {
    type: String,
    required: true
  },
  certification_date: {
    type: Date,
    required: true
  }
});
var SkillSchema = new Schema({
    skill_name: {
        type: String,
        required: true
    },
    skill_desc: {
      type: String,
      required: false
    },
    skill_level: {
        type: Number,
        required: true
    }
});

var LanguageSchema = new Schema({
    language_name: {
        type: String,
        required: true
    },
    language_level: {
        type: Number,
        required: true
    }
});

var EducationSchema = new Schema({
  institution_name: {
    type: String,
    required: false
  },
  course_name: {
    type: String,
    required: true
  },
  course_description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
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
    location: {
      type: String,
      required: false
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
  theme: {
    type: String,
    required: true,
    default: 'simple'
  },
  label: {
    type: String,
    required: false
  },
  uuid: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  address_1: {
    type: String,
    required: true
  },
  address_2: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone_1: {
    type: String,
    required: true
  },
  phone_2: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  current_job_title: {
    type: String,
    required: false
  },
  profile_pic: {
    type: String,
    required: false
  },
  linkedin: {
    type: String,
    required: false
  },
  twitter: {
    type: String,
    required: false
  },
  facebook: {
    type: String,
    required: false
  },
  instagram: {
    type: String,
    required: false
  },
  github: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  date_submitted: {
      type: Date,
      required: false
  },
  certifications: [CertificationSchema],
  skills: [SkillSchema],
  work_experience: [WorkExpSchema],
  education: [EducationSchema],
  languages: [LanguageSchema]
});

module.exports = mongoose.model('Resume', ResumeSchema);