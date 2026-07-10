// export const asyncHandler = (fn) =>{
//     return(req, res, next) =>{
//          fn(req, res, next).catch((error)=> next(new Error(error.message)));
//     };    
// };

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
