import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class CodeCell {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Column()
  type: 'code' | 'text';

  @Column()
  sharedEnvironment: boolean;
}
