const Doctors = require("../schemas/doctors.schema");
const Users = require("../schemas/registration.schema");
const { verifyHash, hashPassword } = require("../utils/cipher.util");
const Appointments = require("../schemas/appointments.schema");
const Consultations = require("../schemas/consultation.schema");
const GetHospitals = require("../schemas/relationships/doctor_belongs_to_many_hospitals");
const Hospitals = require("../schemas/hospitals.schema");
const Department = require("../schemas/departments.schema");
const firebaseController = require("./firestore.controller");
const { db } = require("../config/firebase.config");
const { signRefreshToken } = require("../middlewares/auth.middleware");
const Patient = require("../schemas/patient.schema");
const Reminder = require("../schemas/reminder.schema");
const Request = require("../schemas/request.schema");
const Login = require("../schemas/login.schema");
const eventsSchema = require("../schemas/events.schema");
const { sendEmail } = require("../helpers/mail.helper");

class PatientPostController {
  async createPatient(req, res) {
    try {
      const {
        email,
        password,
        gender,
        date_of_birth,
        address,
        profile_img,
        description,
        occupation,
      } = req.body;
      const user = await Users.findById(req.user.sub);

      if (!user && verifyHash(password, user.password))
        return res
          .status(400)
          .json({ status: 400, message: "Invalid email or password" });

      const patient = await Patient.findOne({ user_id: user._id });
      if (patient)
        return res
          .status(400)
          .json({ status: 400, message: "Patient Already exist" });

      const newPatient = {
        user_id: user._id,
        gender: gender.trim().toLowerCase(),
        date_of_birth: date_of_birth.trim(),
        occupation: occupation.trim(),
        address: address,
      };

      const patients = await Patient.create(newPatient);

      await db
        .collection("Patients")
        .doc(`${patients._id}`)
        .set({
          doctor_id: `${patients._id}`,
          user_id: `${newPatient.user_id}`,
          profile_img: `${profile_img}`,
          description: `${description.trim()}`,
        });
      const token = await signRefreshToken(patients._id);

      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async patientConsultationRequest(req, res) {
    try {
      const patient = await Patient.findById(req.user.sub);
      const doctor = await Doctors.findOne({ email: req.body.email.trim() });

      if (!patient)
        return res
          .status(400)
          .json({ status: 400, message: "request not sent" });
      const doctor_id = req.params.id || doctor._id;

      const newRequest = {
        user_id: [`${patient._id}`, `${doctor_id}`],
        from: `${patient._id}`,
        to: `${doctor_id}`,
        subject: `Consultation`,
        status: `Not Approved`,
      };

      await Request.create(newRequest);
      const token = await signRefreshToken(patient._id);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async patientAppointmentRequest(req, res) {
    try {
      const patient = await Patient.findById(req.user.sub);
      const doctor = await Doctors.findOne({ email: req.body.email.trim() });
      if (!patient)
        return res
          .status(400)
          .json({ status: 400, message: "request not sent" });

      const doctor_id = req.params.id || doctor._id;

      const newRequest = {
        user_id: [`${patient._id}`, `${doctor_id}`],
        from: `${patient._id}`,
        to: `${doctor_id}`,
        subject: `Appointment`,
        status: `Not Approved`,
      };
      
      await Request.create(newRequest);
      const token = await signRefreshToken(patient._id);
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

      const patient = await Patient.findOne({ user_id: user._id });
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
      const token = await signRefreshToken(patient._id);

      if (isLogged.length == 0 ||
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
  <meta property="og:title" content="">
 
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

  async createEvent(req, res) {
    try {
      const { eventTitle: eventTitle, endDate: endDate } = req.body;

      const newEvent = {
        user_id: req.user.sub,
        eventTitle: eventTitle,
        endDate: endDate,
      };

      await eventsSchema.create(newEvent);
      const token = await signRefreshToken(req.user.sub);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

class PatientGetController {
  async getpatientData(req, res) {
    try {
      const patient = await Patient.findById(req.user.sub);
      const user = await Users.findOne({ _id: patient.user_id });
      if (!patient)
        return res
          .status(400)
          .json({ status: 400, message: "request timeout" });
      const firestorepatientData = await db
        .collection("Patients")
        .doc(`${patient._id}`)
        .get();

      res
        .status(200)
        .json({
          status: 200,
          message: [user, firestorepatientData.data(), patient],
        });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getPatientsEvents(req, res) {
    try {
      const patientEvents = await eventsSchema.find({ user_id: req.user.sub });
      res.status(200).json({ status: 200, message: patientEvents });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getPatientsConsultaions(req, res) {
    try {
      const user_id = req.user.sub;
      const requests = await Request.find({
        user_id: user_id,
        subject: "Consultation",
      });
      res.status(200).json({ status: 200, message: requests });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getPatientsAppointments(req, res) {
    try {
      const user_id = req.user.sub;
      const requests = await Request.find({
        from: user_id,
        subject: "Appointment",
      });
      res.status(200).json({ status: 200, message: requests });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

class PatientPutController {
  async updateProfile(req, res) {
    try {
      const {
        password,
        new_password,
        date_of_birth,
        profile_img,
        description,
      } = req.body;

      const user = await Patient.findById(req.user.sub);
      const token = await signRefreshToken(user._id);
      if (password) {
        if (!user && !verifyHash(password, user.password))
          return res
            .status(400)
            .json({ status: 400, message: "Unable to change password" });
        const updatePassword = {
          new_password: hashPassword(new_password),
        };

        const token = await signRefreshToken(user._id);
        await Users.updateOne(
          { $where: { _id: user.user_id } },
          { $set: updatePassword }
        );
        res.status(200).json({ status: 200, message: token });
      }

      const updatePatient = {
        profile_img: profile_img,
        description: description,
      };

      const patients = await Patient.updateOne(
        { $where: { _id: user._id } },
        { $set: { date_of_birth: date_of_birth } }
      );

      await db.collection("Patients").doc(`${user._id}`).update(updatePatient);

      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateConsultaion(req, res) {
    try {
      const { email } = req.body;
      const doctor = await Doctors.findOne({ email: email.trim() });

      const doctor_id = req.params.id || doctor._id;
      if (!doctor_id)
        return res.status(400).json({ status: 400, message: "invalid email" });

      const newRequest = {
        user_id: [`${req.user.sub}`, `${doctor_id}`],
        to: `${doctor_id}`,
      };

      await Request.updateOne(
        { $where: { _id: req.params.id } },
        { $set: newRequest }
      );

      const token = await signRefreshToken(req.user.sub);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateAppointment(req, res) {
    try {
      const { email } = req.body;
      const doctor = await Doctors.findOne({ email: email.trim() });

      const doctor_id = req.params.id || doctor._id;
      if (!doctor_id)
        return res.status(400).json({ status: 400, message: "invalid email" });

      const newRequest = {
        user_id: [`${req.user.sub}`, `${doctor_id}`],
        to: `${doctor_id}`,
      };

      await Request.updateOne(
        { $where: { _id: req.params.id } },
        { $set: newRequest }
      );

      const token = await signRefreshToken(req.user.sub);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const { eventTitle, eventDescription, allDay, importance } = req.body;

      const newEvent = {
        user_id: req.user.sub,
        eventTitle: eventTitle,
        eventDescription: eventDescription,
        allDay: allDay,
        importance: importance,
      };

      await eventsSchema.updateOne(
        { $where: { _id: req.params.id } },
        { $set: newEvent }
      );
      const token = await signRefreshToken(req.user.sub);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

class PatientDeleteController {
  async deleteRequest(req, res) {
    try {
      const request_id = req.params.id;
      await Request.deleteOne({ _id: req.params.id });
      const token = await signRefreshToken(req.user.sub);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
  async deleteEvent(req, res) {
    try {
      await eventsSchema.deleteOne({ _id: req.params.id });
      const token = await signRefreshToken(req.user.sub);
      res.status(200).json({ status: 200, message: token });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  }
}

module.exports = {
  PatientPostController: new PatientPostController(),
  PatientGetController: new PatientGetController(),
  PatientPutController: new PatientPutController(),
  PatientDeleteController: new PatientDeleteController(),
};
