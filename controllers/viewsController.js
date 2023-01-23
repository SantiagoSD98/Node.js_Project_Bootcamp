const Tour = require('../models/tourModel');
const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) GET TOUR DATA FROM COLLECTION
  const tours = await Tour.find();
  // 2) BUILD TEMPLATE

  // 3) RENDER THAT TEMPLATE USING TOUR DATA FROM 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {

  // 1) GET THE DATA, FOR THE REQUESTED TOUR (including reviews and tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    next(new AppError('Could not find the tour.', 404));
  }

  // 2) BUILD TEMPLATE

  // 3) RENDER TEMPLATE USING DATA FROM STEP ONE
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
});