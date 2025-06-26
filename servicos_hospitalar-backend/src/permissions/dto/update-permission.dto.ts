import { PartialType } from '@nestjs/mapped-types';
import { AssignPermissionDto } from './assign-permission.dto';

export class UpdatePermissionDto extends PartialType(AssignPermissionDto) {} 