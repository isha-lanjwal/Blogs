const responseCode = {
        200: "OK",
        201: "CREATED",
        204: "No Content",
        400: "BAD_REQUEST_ERROR",
        401: "UNAUTHORIZED_ERROR",
        402: "REQUEST_FAILED_ERROR",
        403: "FORBIDDEN",
        404: "NOT_FOUND_ERROR",
        409: "CONFLICT_ERROR",
        429: "TOO_MANY_REQUESTS_ERROR",
        500: "SERVER_ERROR",
        502: "API_CONNECTION_ERROR",
        422: "UNPROCESSABLE_ENTITY"

};
export default responseCode;