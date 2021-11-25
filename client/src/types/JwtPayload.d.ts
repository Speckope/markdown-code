import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
  userName: string;
  userId: string;
}
