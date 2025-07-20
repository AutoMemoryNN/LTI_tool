import { type AppRole, type AppRoles, PERMISSION, ROLE_NAME } from './role.types';

export const RoleManager = new (class {
    private defaultRoles: Record<ROLE_NAME, AppRole> = {
        [ROLE_NAME.ADMIN]: {
            roleName: ROLE_NAME.ADMIN,
            permissions: [PERMISSION.ADMIN_MANAGE, PERMISSION.ADMIN_READ],
        },
        [ROLE_NAME.INSTRUCTOR]: {
            roleName: ROLE_NAME.INSTRUCTOR,
            permissions: [PERMISSION.INSTRUCTOR_MANAGE, PERMISSION.INSTRUCTOR_READ],
        },
        [ROLE_NAME.STUDENT]: {
            roleName: ROLE_NAME.STUDENT,
            permissions: [PERMISSION.STUDENT_MANAGE, PERMISSION.STUDENT_READ],
        },
        [ROLE_NAME.GUEST]: {
            roleName: ROLE_NAME.GUEST,
            permissions: [PERMISSION.GUEST_READ],
        },
    };

    private ltiRolesMapping: Record<string, ROLE_NAME> = {
        // LTI admin roles supported
        Administrator: ROLE_NAME.ADMIN,
        'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Administrator': ROLE_NAME.ADMIN,
        'http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor': ROLE_NAME.INSTRUCTOR,
        'http://purl.imsglobal.org/vocab/lis/v2/system/person#Administrator': ROLE_NAME.ADMIN,

        // LTI instructor roles supported
        Instructor: ROLE_NAME.INSTRUCTOR,
        'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Mentor': ROLE_NAME.INSTRUCTOR,
        'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Instructor': ROLE_NAME.INSTRUCTOR,

        // LTI student roles supported
        'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner': ROLE_NAME.STUDENT,
        'http://purl.imsglobal.org/vocab/lis/v2/membership#Student': ROLE_NAME.STUDENT,
        'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student': ROLE_NAME.STUDENT,
        'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Learner': ROLE_NAME.STUDENT,
        Student: ROLE_NAME.STUDENT,
        Learner: ROLE_NAME.STUDENT,

        // LTI guest roles supported
        'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Guest': ROLE_NAME.GUEST,
    };

    getAppRole(roleName: ROLE_NAME): AppRole {
        return this.defaultRoles[roleName] || this.defaultRoles[ROLE_NAME.STUDENT]; // Default to STUDENT if not found
    }

    getAppRoles(): AppRoles {
        return Object.values(this.defaultRoles);
    }

    hasPermission(appRoles: AppRoles, permission: PERMISSION): boolean {
        for (const role of appRoles) {
            if (role.permissions.includes(permission)) {
                return true;
            }
        }
        return false;
    }

    getAppRolesFromLtiRoles(ltiRoles: string[]): AppRole[] {
        const mappedRoles: ROLE_NAME[] = ltiRoles
            .map((ltiRole) => this.ltiRolesMapping[ltiRole])
            .filter((role) => role !== undefined);

        if (mappedRoles.includes(ROLE_NAME.ADMIN)) {
            return this.getAppRoles(); // Return all roles if admin
        }

        if (mappedRoles.includes(ROLE_NAME.INSTRUCTOR)) {
            return [this.getAppRole(ROLE_NAME.INSTRUCTOR)];
        }

        if (mappedRoles.includes(ROLE_NAME.STUDENT)) {
            return [this.getAppRole(ROLE_NAME.STUDENT)];
        }

        if (mappedRoles.includes(ROLE_NAME.GUEST)) {
            return [this.getAppRole(ROLE_NAME.GUEST)];
        }

        return [this.getAppRole(ROLE_NAME.STUDENT)]; // Default to STUDENT
    }
})();
