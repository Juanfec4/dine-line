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
  ORDER_CONFIRMATION = 'order-confirmation.email',
}

export enum EmailSubject {
  VERIFICATION = 'Dine Line verification code',
  PASSWORD_CHANGE = 'Dine Line password recovery',
  ORDER_CONFIRMATION = 'Dine Line Order',
}

export enum ReviewFilterType {
  USER = 'user',
  MENU_ITEM = 'menu-item',
  ANY = 'any',
}

export enum OrderStatus {
  PENDING,
  COMPLETED,
  CANCELLED,
}

export enum PaymentMethods {
  CREDIT,
  DEBIT,
  PAYPAL,
  CRYPTO,
}

export enum SseAction {
  UPDATE = 'update',
  CREATE = 'create',
  DELETE = 'delete',
}
