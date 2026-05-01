import RefreshToken from "../models/refresh-token.model.js";

export const createRefreshToken = (data) => {
  return RefreshToken.create(data);
};

export const findRefreshToken = (hashedToken) => {
  return RefreshToken.findOne({ token: hashedToken });
};

export const deleteRefreshTokenById = (id) => {
  return RefreshToken.deleteOne({ _id: id });
};