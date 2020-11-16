import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Vendor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyName!: string;

  @Column()
  eventName!: string;

  @Column()
  boothNumber!: number;

  @Column()
  mezzanine!: number;
}
