export const get = (req, res) => {
  const { id } = req.query || {};

  return {
    id,
    type: "a",
  };
};

export const post = async (req: any, res: any) => {
  const { id } = req.body || {};

  return {
    id,
    type: "a",
  };
};
