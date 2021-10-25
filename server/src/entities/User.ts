import { Entity, ObjectIdColumn, Column, ObjectID } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  githubId: string;
}
