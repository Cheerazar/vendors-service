import { Entity, Column, BaseEntity } from 'typeorm';

// There can be multiple mezzanine areas for a single locationId
@Entity()
export class Mezzanine extends BaseEntity {
  // This will be the id from the Mongo document sent over Rabbit
  // for the mezzanine
  @Column()
  id!: string;

  @Column()
  floorNum!: string;

  @Column()
  maxPossibleBoothSpaces!: number;

  // The id for the mongo doc for the location id that houses the
  // mezzanine
  @Column()
  locationId!: string;
}
