import type { AppRole } from '@shared/role-manager';

export interface AppUser {
    id: string;
    email: string;
    name: string;
    givenName?: string;
    roles: AppRole[];
}

export type CourseLaunchData = {
    courseId: string;
    courseName: string;
    courseType: string;
    resourceName: string;
    returnUrl: string;
    membershipsUrl: string;
};
