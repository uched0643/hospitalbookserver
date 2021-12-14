const Doctors = require("../schemas/doctors.schema");
const Users = require("../schemas/registration.schema");
const { verifyHash } = require("../utils/cipher.util");
const Appointments = require("../schemas/appointments.schema");
const Consultations = require("../schemas/consultation.schema");
const GetHospitals = require("../schemas/relationships/doctor_belongs_to_many_hospitals");
const Hospitals = require("../schemas/hospitals.schema");
const Department = require("../schemas/departments.schema");
const firebaseController = require("./firestore.controller");
const { db } = require("../config/firebase.config");
const { signRefreshToken } = require("../middlewares/auth.middleware");
const Patient = require("../schemas/patient.schema");
const { sendEmail } = require("../helpers/mail.helper");
const requestSchema = require("../schemas/request.schema");
const hospitalsSchema = require("../schemas/hospitals.schema");
const Login = require("../schemas/login.schema");

class DoctorsPostController {
  async createDOctor(req, res) {
    try {
      const {
        email,
        password,
        date_of_birth,
        gender,
        specialty,
        experience,
        address,
      } = req.body;

      const user = await Users.findOne({ email: email.trim() });
      const user_password = verifyHash(password, user.password);

      const checkDoctor = await Doctors.findOne({ user_id: user._id });

      if (checkDoctor)
        return res
          .status(400)
          .json({ status: 400, message: "Doctor Already exist" });

      if (!user && !user_password)
        return res
          .status(400)
          .json({ status: 400, message: "Invalid email or password" });

      const newDoctor = {
        user_id: user._id,
        gender: gender.trim().toLowerCase(),
        date_of_birth: date_of_birth.trim(),
        specialty: specialty,
        experience: experience.trim(),
        address: address,
      };

      const doctor = await Doctors.create(newDoctor);

      await db
        .collection("Doctors")
        .doc(`${doctor._id}`)
        .set({
          doctor_id: `${doctor._id}`,
          user_id: `${newDoctor.user_id}`,
          profile_img: `${req.body.profile_img}`,
          description: `${req.body.description.trim()}`,
        });
      await sendEmail(
        user.email.trim(),
        `Role Changed`,
        `
        <p>${user.email} you have been granted access as a doctor.
        Request to work under a hospital</p>
        `
      );
      const token = await signRefreshToken(doctor._id);

      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async appointment(req, res) {
    try {
      const patient = await Users.findOne({
        email: req.body.patient_email.trim(),
      });
      let doctor = await Doctors.findById(req.user.sub);
      doctor = await Users.findOne({ _id: doctor.user_id });

      if (!patient)
        return res
          .status(400)
          .json({ status: 400, message: "Patient Not Found" });

      const newAppointment = {
        patient_id: patient._id,
        doctors_id: doctor,
        dateString: req.body.dateStr.trim(),
        status: "Success",
      };

      const appointment = await Appointments.create(newAppointment);
      await db
        .collection("Appointments")
        .doc(`${appointment._id}`)
        .set({
          appointment_id: `${appointment._id}`,
          reason: `${req.body.reason.trim()}`,
        });
      const token = await signRefreshToken(doctor._id);
      // send booth the patient and the doctor confirmation emails
      await sendEmail(
        patient.email,
        "Appointment",
        `
      <p>Dear ${patient.first_name} ${patient.last_name} , 
      Your Appointment With Dr ${doctor.first_name} ${doctor.last_name}
      is Scheduled ${newAppointment.dateString}
      `
      );
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async consultation(req, res, next) {
    try {
      const {
        patient_email,
        reason,
        blood_pressure,
        respiratory_rate,
        weight,
        height,
        blood_group,
        heart_beat,
        disease,
        conclusion,
      } = req.body;

      const user = await Users.findOne({ email: patient_email.trim() });
      const patient = await Patient.findOne({ user_id: user._id });

      let doctor = await Doctors.findById(req.user.sub);
      doctor = await Users.findOne({ _id: doctor.user_id });

      if (!patient)
        return res
          .status(400)
          .json({ status: 400, message: "Patient Not Found" });
      if (!doctor)
        return res
          .status(400)
          .json({ status: 400, message: "Invalid Credentials" });

      const newConsultation = {
        patient_id: patient._id,
        doctors_id: doctor._id,
        reason: reason.substring(0, 20),
        consultation_id: `${patient._id}$${doctor._id}`,
      };

      await Consultations.create(newConsultation);
      await db
        .collection("Consultations")
        .doc(`${newConsultation.patient_id}$${newConsultation.doctors_id}`)
        .set({
          consultation_id: `${newConsultation.patient_id}$${newConsultation.doctors_id}`,
          reason: `${reason}`,
          disease: `${disease}`,
          blood_pressure: `${blood_pressure}`,
          blood_group: `${blood_group}`,
          respiratory_rate: `${respiratory_rate}`,
          weight: `${weight}`,
          height: `${height}`,
          heart_beat: `${heart_beat}`,
          conclusion: `${conclusion}`,
          consultation_time: `${new Date()}`,
        });

      const token = await signRefreshToken(req.user.sub);
      // store img, video, consultation_id, _id to firebase

      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async createFolder(req, res, next) {
    try {
      const { name } = await req.body;
      const doctor = await Doctors.findById(req.user.sub);
      const user = await Users.findOne({ _id: doctor.user_id });
      let folders = await db
        .collection("Folders")
        .doc(`${req.user.sub}`)
        .collection(`${req.user.sub}$${user.email}`)
        .get();
      const folderNames = folders.docs.filter((a) => a.id == `${name}`);
      if (folderNames)
        return res
          .status(400)
          .json({ status: 400, message: "Folder name already exist" });

      await db
        .collection("Folders")
        .doc(`${req.user.sub}`)
        .collection(`${req.user.sub}$${user.email}`)
        .doc(`${name}`)
        .set({});

      const token = await signRefreshToken(doctor._id);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async requestTpHospital(req, res) {
    try {
      const doctor = await Doctors.findById(req.user.sub);
      const hospital = await hospitalsSchema.findById(req.params.id);
      await requestSchema.create({
        user_ids: [`${doctor._id}`, `${hospital._id}`],
        from: `${doctor._id}`,
        to: `${hospital._id}`,
        subject: "Request to be part of this hospital",
        status: "pending",
      });
      const token = signRefreshToken(doctor._id);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({
        email: email.trim(),
      });

      const doctor = await Doctors.findOne({ user_id: user._id });
      const hashPassword = verifyHash(password, user.password);

      if (!user.active)
        return res
          .status(400)
          .json({ status: 400, message: "Please Activate your account" });

      if (!user && !hashPassword)
        return res.status(400).json({
          status: 400,
          error_message: "Invalid username or password",
          message: email,
        });

      const isLogged = await Login.find({ email: email.trim() });

      let login = {
        user_id: user._id,
        email: user.email,
        user_agent: req.headers["user-agent"],
      };

      await Login.create(login);
      const token = await signRefreshToken(doctor._id);

      if (
        isLogged[isLogged.length - 1].user_agent != req.headers["user-agent"]
      ) {
        await sendEmail(
          login.email,
          `Login`,
          `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta property="og:title" content="Verify Your Email">
 
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="width:100% ;-webkit-text-size-adjust:none;margin:0;padding:0;background-color:#FFF;">
  <center>
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable" style="height:100% ;margin:0;padding:0;width:100% ;background-color:#FFF;">
      <tr>
        <td align="center" valign="top" style="border-collapse:collapse;">
          <table border="0" cellpadding="10" cellspacing="0" width="450" id="templatePreheader" style="background-color:#FAFAFA;">
            <tr>
              <td valign="top" class="preheaderContent" style="border-collapse:collapse;">
             
                <table border="0" cellpadding="10" cellspacing="0" width="100%">
                  <tr>
                    <td valign="top" style="border-collapse:collapse;">
                   
                    </td>
                  </tr>
                </table>
             
              </td>
            </tr>
          </table>
          <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateContainer" style="border:1px none #DDDDDD;background-color:#FFFFFF;">
            <tr>
              <td align="center" valign="top" style="border-collapse:collapse;">
             
                <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateHeader" style="background-color:#FFFFFF;border-bottom:0;">
                  <tr>
                    <td class="headerContent centeredWithBackground" style="border-collapse:collapse;color:#202020;font-family:Arial;font-size:34px;font-weight:bold;line-height:100%;padding:0;text-align:center;vertical-align:middle;    padding-bottom: 0px; padding-top: 0px;  background: #1D4ED8; overflow: hidden;">
                 
                      <img width="130" src="../utils/logo.jpeg" style="height: 105px !important;
                      line-height: 100%;
                      outline: none;
                      text-decoration: none;
                      transform: scale(2);" id="headerImage campaign-icon">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="border-collapse:collapse;">
               
                <table border="0" cellpadding="0" cellspacing="0" width="450" id="templateBody">
                  <tr>
                    <td valign="top" class="bodyContent" style="border-collapse:collapse;background-color:#FFFFFF;">
                      
                      <table border="0" cellpadding="20" cellspacing="0" width="100%" style="padding-bottom:10px;">
                        <tr>
                          <td valign="top" style="padding-bottom:1rem;border-collapse:collapse;" class="mainContainer">
                            <div style="text-align:center;color:#505050;font-family:Arial;font-size:14px;line-height:150%;">
                              <h1 class="h1" style="color:#202020;display:block;font-family:Arial;font-size:24px;font-weight:bold;line-height:100%;margin-top:20px;margin-right:0;margin-bottom:20px;margin-left:0;text-align:center;">Logged With New Client</h1>

                              <p>You Logged In On <br> ${login.user_agent}</p>
                            </div>
                          </td>
                        </tr>
                      
                      </table>
                     
                    </td>
                  </tr>
                </table>
               
              </td>
            </tr>
           
            <tr>
              <td align="center" valign="top" style="border-collapse:collapse;">
              
                <table border="0" cellpadding="10" cellspacing="0" width="450" id="templateFooter" style="background-color:#FFFFFF;border-top:0;">
                  <tr>
                    <td valign="top" class="footerContent" style="padding-left:0;border-collapse:collapse;background-color:#fafafa;">
                      <div style="text-align:center;color:#757373;font-family:Arial;font-size:11px;line-height:150%;">
                        <p style="text-align:center;margin:0;margin-top:2px;">Record | Hospital,Douala Bali | Copyright © 2021 | All rights reserved</p>
                      </div>
                     
                    </td>
                  </tr>
                </table>
            
              </td>
            </tr>
          </table>
          <br>
        </td>
      </tr>
    </table>
  </center>
</body>

</html>
                `
        );
      }
      res.status(200).json({ status: 200, message: login, token: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
  
}

class DoctorsGetController {
  async getDoctorsHospitals(req, res) {
    try {
      const getDoctorsHospitals = await GetHospitals.findOne({
        doctor_id: req.params.id,
      });
      const hospitals = await Hospitals.find({
        _id: getDoctorsHospitals.hospital_id,
      });
      const department = await Department.find({
        doctor_id: getDoctorsHospitals.doctor_id,
      });

      res.status(200).json({ status: 200, data: [hospitals, department] });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getDoctor(req, res) {
    try {
      let user = await Doctors.findById(req.user.sub);
      let doctorUser = await Users.findById(user.user_id);
      let firebaseData = await db
        .collection("Doctors")
        .doc(`${user._id}`)
        .get();
      // get doctors hospitals and his verious departments ....
      res.status(200).json({
        status: 200,
        message: [user, firebaseData.data(), doctorUser],
      });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getFolders(req, res) {
    try {
      const doctor = await Doctors.findById(req.user.sub);
      const user = await Users.findById(doctor.user_id);

      let folders = await db
        .collection("Folders")
        .doc(`${req.user.sub}`)
        .collection(`${req.user.sub}$${user.email}`)
        .get();

      const folderNames = folders.docs.map((response) => response.id);
      folders = folders.docs.map((response) => response.data());

      res
        .status(200)
        .json({ status: 200, message: folders, other: folderNames });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

class DoctorsPutController {
  async updateProfile(req, res) {
    try {
      const doctor = await Doctors.findById(req.user.sub);
      const { profile_img, description, specialty, name, gender } = req.body;

      const updateProfile = {
        gender: gender,
        name: name,
        specialty: specialty,
      };

      await Doctors.findByIdAndUpdate(req.user.sub, { $set: updateProfile });
      // update doctors img and desc in firebase.
      await db
        .collection("Doctors")
        .doc(`${doctor._id}`)
        .update({
          profile_img: `${profile_img}`,
          description: `${description.trim()}`,
        });

      const token = signRefreshToken(doctor._id);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async editAppointment(req, res) {
    try {
      const appointment = await Appointments.findById(req.params.id);
      if (!appointment)
        return res
          .status(400)
          .json({ status: 400, message: "Appointment expired" });

      const { reason, dateString } = req.body;

      await Appointments.findByIdAndUpdate(req.params.id, {
        $set: { reason: reason, dateString: dateString },
      });

      res.status(200).json({ status: 200, message: "OK" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async editConsultation(req, res) {
    try {
      const {
        reason,
        blood_pressure,
        respiratory_rate,
        weight,
        height,
        blood_group,
        heart_beat,
        disease,
        conclusion,
      } = req.body;

      const consultation = await Consultations.findByIdAndUpdate(
        req.params.id,
        { $set: { reason: reason } }
      );

      await db
        .collection("Consultations")
        .doc(`${consultation.patient_id}$${consultation.doctors_id}`)
        .update({
          reason: `${reason}`,
          disease: `${disease}`,
          blood_pressure: `${blood_pressure}`,
          blood_group: `${blood_group}`,
          respiratory_rate: `${respiratory_rate}`,
          weight: `${weight}`,
          height: `${height}`,
          heart_beat: `${heart_beat}`,
          conclusion: `${conclusion}`,
          consultation_time: `${new Date()}`,
        });

      const token = await signRefreshToken(req.user.sub);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

class DoctorsDeleteController {
  async deletePastAppointments(req, res, next) {
    try {
      await Appointments.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: 200, message: "OK" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async deletePastConsultations(req, res, next) {
    try {
      await Consultations.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: 200, message: "OK" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async deleteFolder(req, res, next) {
    try {
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

module.exports = {
  PostController: new DoctorsPostController(),
  GetController: new DoctorsGetController(),
  PutController: new DoctorsPutController(),
  DeleteController: new DoctorsDeleteController(),
};
