import { Role } from './role';
import { Tenant } from './tenant';

export interface Player extends Tenant {
    _id?: string;
    name: string;
    nationality: string;
    number: string;
    yearBirth: number;
    height: number;
    weight: number;
    role: Role;
}
