const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) CREATE ERROR IF USER POST's PASSWORD DATA
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update. Please use /updateMyPassword', 400));
    }

    // 2) FILTERED UNWANTED FIELDS TO UPDARTE
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) UPDATE USER DOCUMENT
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});


exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route not defined! Please use /signup instead.'
    });
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);
// DO NOT UPDATE PASSWORDS WITH THIS
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);