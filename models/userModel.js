'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
        }

        async isPasswordMatched(enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
        }

        async createPasswordResetToken() {
            const resetToken = crypto.randomBytes(32).toString("hex");
            this.passwordResetToken = crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            this.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
            return resetToken;
        }
    }

    User.init({
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notNull: true,
            },
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "user",
        },
        isBlocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        cart: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            defaultValue: [],
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        passwordChangedAt: {
            type: DataTypes.DATE,
        },
        passwordResetToken: {
            type: DataTypes.STRING,
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
        },
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
    });

    // Hash password before saving
    User.beforeCreate(async (user) => {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    });

    return User;
};
