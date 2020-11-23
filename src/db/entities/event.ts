import { Entity, Column, BaseEntity } from 'typeorm';

@Entity()
export class Event extends BaseEntity {
  // This will be the id from the Mongo document sent over Rabbit
  @Column()
  id!: string;

  @Column()
  availableBooths!: number;

  @Column()
  locationId!: string;

  @Column()
  name!: string;
}
