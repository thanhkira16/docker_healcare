import db from "../models/index";
import doctorService from "../services/doctorService";

const getTopDoctorHome = async (req, res) => {
  const numOfDoctors = req.query.numOfDoctors || 10; // Default to 10 doctors if not provided
  try {
    const response = await doctorService.getTopDoctorHomeService(+numOfDoctors);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in getTopDoctorHome:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: error,
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let data = await doctorService.getAllDoctors();
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    console.log("Get all doctor service error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error getting all doctor service",
    });
  }
};
let postInfoDoctor = async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.query);
    let data = await doctorService.saveInfoDoctor(req.body);
    return res.status(200).json(data);
  } catch (err) {
    console.log("post infor doctor service error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error postInfoDoctor dctor controllers",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let data = await doctorService.getDetailDoctorByIdService(req.query.id);
    return res.status(200).json(data);
  } catch (err) {
    console.log("Get detail doctor error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error getting doctor by id service",
    });
  }
};
let getScheduleDoctorByDate = async (req, res) => {
  try {
    // console.log(req.query);
    let data = await doctorService.getScheduleDoctorByDateService(
      req.query.doctorId,
      req.query.date.trim()
    );
    return res.status(200).json(data);
  } catch (err) {
    console.log("Get getScheduleDoctorByDate: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error getScheduleDoctorByDate service" + err,
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let data = await doctorService.bulkCreateScheduleService(req.body);
    // console.log(req.body);
    return res.status(200).json(data);
  } catch (err) {
    console.log("bulkCreateSchedule error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error bulkCreateSchedule",
    });
  }
};

let getExtraInforDoctorByID = async (req, res) => {
  try {
    console.log("check req", req.body.doctorId, req.query.doctorId);
    let data = await doctorService.getExtraInforDoctorByIDService(
      req.query.doctorId
    );
    // console.log(req.body);
    return res.status(200).json(data);
  } catch (err) {
    console.log("getExtraInforDoctorByID error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error getExtraInforDoctorByID: " + err,
    });
  }
};
let getProfileDoctorByID = async (req, res) => {
  try {
    console.log("check req", req.body.doctorId, req.query.doctorId);
    let data = await doctorService.getProfileDoctorByIDService(
      req.query.doctorId
    );
    // console.log(req.body);
    return res.status(200).json(data);
  } catch (err) {
    console.log("getProfileDoctorByID error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error getProfileDoctorByID: " + err,
    });
  }
};
let getListPatientsBooked = async (req, res) => {
  try {
    let data = await doctorService.getListPatientsBookedService(
      req.query.doctorId,
      req.query.date
    );
    // console.log(req.body);
    return res.status(200).json(data);
  } catch (err) {
    console.log("getListPatientsBooked error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error getListPatientsBooked: " + err,
    });
  }
};
let sendRemedy = async (req, res) => {
  try {
    let data = await doctorService.sendRemedyService(req.body);
    // console.log(req.body);
    return res.status(200).json(data);
  } catch (err) {
    console.log("sendRemedy error: ", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error sendRemedy: " + err,
    });
  }
};
module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  postInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleDoctorByDate,
  getExtraInforDoctorByID,
  getProfileDoctorByID,
  getListPatientsBooked,
  sendRemedy,
};
