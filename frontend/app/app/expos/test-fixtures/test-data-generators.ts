/* istanbul ignore file */
import faker from 'faker';

/**
 * Creates an iterator of that returns fake Users.
 *
 * Usage:
 *      const fakeUsers = Array.from(generateUser(5));
 * @param qty number of items to generate
 */
export function* generateUser(qty: number) {
    for (let i = 0; i < qty; i++) {
        yield {
            id: faker.random.uuid(),
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            email: faker.internet.email(),
            avatarUrl: faker.image.avatar(),
        };
    }
}

/**
 * Creates an iterator that returns fake Groups
 *
 * Usage:
 *      const groups = Array.from(generateGroup(5));
 * @param qty number of items to generate
 */
export function* generateGroup(qty: number) {
    for (let i = 0; i < qty; i++) {
        yield {
            id: faker.random.uuid(),
            name: `${faker.company.bsNoun()} ${faker.commerce.department}`,
        };
    }
}
