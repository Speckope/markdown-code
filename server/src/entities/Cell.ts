import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Cell {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Column()
  type: 'code' | 'text';

  @Column()
  sharedEnvironment: boolean;
}
