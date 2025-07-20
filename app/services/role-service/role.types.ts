export enum ROLE_NAME {
    ADMIN = 'admin',
    INSTRUCTOR = 'instructor',
    STUDENT = 'student',
    GUEST = 'guest',
}

// test RBAC
export enum PERMISSION {
    ADMIN_MANAGE = 'admin:manage',
    ADMIN_READ = 'admin:read',
    INSTRUCTOR_MANAGE = 'instructor:manage',
    INSTRUCTOR_READ = 'instructor:read',
    STUDENT_MANAGE = 'student:manage',
    STUDENT_READ = 'student:read',
    GUEST_READ = 'guest:read',
}

export interface AppRole {
    roleName: ROLE_NAME;
    permissions: PERMISSION[];
}

export type AppRoles = AppRole[];
