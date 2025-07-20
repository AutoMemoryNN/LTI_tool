import type { AppRole } from '@services/role-service';

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

export type CookieData = {
    userId: string;
    userEmail: string;
    userName: string;
    userGivenName?: string;
};
