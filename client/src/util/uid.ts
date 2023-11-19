let uid = 0;

const premappedIds = new Map();

export const getUid = () => {
  return uid++;
};

export const getUidFor = (reserved: string) => {
  if (!premappedIds.has(reserved)) {
    premappedIds.set(reserved, getUid());
  }
  return premappedIds.get(reserved);
};
