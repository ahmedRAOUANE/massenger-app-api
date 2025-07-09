export const MESSAGES = {
    validation: {
        invalidEmail: "invalid email format, the email should be in format: example@email.com or example@gmail.com",
        invalidPassword: "password is invalid, password should be at least 6 characters",
        invalidName: "username is invalid"
    },
    missingData: {
        missingName: "name is required",
        missingEmail: "email is required",
        missingId: "id is required",
        missingPassword: "password is required",
        missingNameOrEmail: "name or email is required",
        missingUser: "no user or users found",
    },
    fail: {
        creatingUser: "failed to create user",
        updateUser: "failed to update user",
        deleteUser: "failed to delete user"
    },
    error: {
        serverError: "Internal Server Error"
    },
    success: {
        creatingUser: "user have been created successfully",
        updatingUser: "user have been updated successfully",
        deletingUser: "user have been deleted successfully",
        gettingUser: "user",
        gettingUsers: "users",
    }
}

// export const MESSAGES = {
//     validation: {
//         email: {
//             invalid: "Email is invalid",
//             missing: "Email is required",
//         },
//         password: {
//             invalid: "Password must be at least 6 characters",
//             missing: "Password is required",
//         },
//         name: {
//             invalid: "Username is invalid",
//             missing: "Name is required",
//         },
//         id: {
//             missing: "ID is required",
//             invalid: "ID format is invalid",
//         },
//     },

//     user: {
//         notFound: "User not found",
//         create: {
//             fail: "Failed to create user",
//             success: "User has been created successfully",
//         },
//         update: {
//             fail: "Failed to update user",
//             success: "User has been updated successfully",
//         },
//         delete: {
//             fail: "Failed to delete user",
//             success: "User has been deleted successfully",
//         },
//         fetch: {
//             single: "User fetched successfully",
//             multiple: "Users fetched successfully",
//         },
//     },

//     error: {
//         server: "Internal server error",
//     },
// };
  