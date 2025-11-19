export function initialsFromName(firstName, lastName) {
const a = firstName ? firstName.charAt(0).toUpperCase() : '';
const b = lastName ? lastName.charAt(0).toUpperCase() : '';
return `${a}${b}` || 'U';
}