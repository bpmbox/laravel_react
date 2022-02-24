import { Role, roleToString, roleFromString } from './enums';

describe('roleToString', () => {
    it('should return correct display string for role', () => {
        expect(roleToString(Role.ADMIN)).toBe('Admin');
        expect(roleToString(Role.GUEST)).toBe('Guest');
        expect(roleToString(Role.MEMBER)).toBe('Member');
        expect(roleToString(Role.OWNER)).toBe('Owner');
    });
});

describe('roleFromString', () => {
    it('should return correct role for given string', () => {
        expect(roleFromString('admin')).toBe(Role.ADMIN);
        expect(roleFromString('guest')).toBe(Role.GUEST);
        expect(roleFromString('member')).toBe(Role.MEMBER);
        expect(roleFromString('owner')).toBe(Role.OWNER);

        expect(roleFromString('Admin')).toBe(Role.ADMIN);
        expect(roleFromString('Guest')).toBe(Role.GUEST);
        expect(roleFromString('Member')).toBe(Role.MEMBER);
        expect(roleFromString('Owner')).toBe(Role.OWNER);

        expect(() => roleFromString('Invalid')).toThrow();
    });
});
