import type { ConfigService } from '@nestjs/config';
export declare function createLtiProvider(config: ConfigService): void;
export declare function setupLti(config: ConfigService): Promise<Express.Application>;
