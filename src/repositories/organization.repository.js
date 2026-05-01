import Organization from "../models/organization.model.js";

const assertSession = (session) => {
  if (!session) {
    throw new Error("SESSION_REQUIRED");
  }
};

export const createOrganization = (data, session) => {
  assertSession(session);

  return Organization.create([data], { session });
};

export const updateOrganizationOwner = (organization, ownerId, session) => {
  assertSession(session);

  organization.ownerId = ownerId;
  return organization.save({ session });
};