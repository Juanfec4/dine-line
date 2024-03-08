export enum UserStatus {
  VERIFIED,
  UNVERIFIED,
  DELETED,
}

export enum EmailPriority {
  LOW = 9,
  MEDIUM = 6,
  HIGH = 3,
}

export enum EmailTemplate {
  VERIFICATION = 'verification.email',
  PASSWORD_CHANGE = 'password-change.email',
}

export enum EmailSubject {
  VERIFICATION = 'Dine Line verification code',
  PASSWORD_CHANGE = 'Dine Line password recovery',
}

export enum ReviewFilterType {
  USER = 'user',
  MENU_ITEM = 'menu-item',
  ANY = 'any',
}
