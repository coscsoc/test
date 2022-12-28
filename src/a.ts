export const get = (req:any, res:any) => {
  const { id } = req.query || {};

  return {
    id,
    type: "permission",
  };
};

export const post = async (req:any, res:any) => {
  return {
    body: req.body,
    type: "permission",
  };
};
