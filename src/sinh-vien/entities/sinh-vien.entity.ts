import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SinhVien')
export class SinhVien {
  @PrimaryColumn({ name: 'MaSV', type: 'varchar', length: 20 })
  MaSV: string;

  @Column({ name: 'HoTen', type: 'varchar', length: 255 })
  HoTen: string;

  @Column({ name: 'Email', type: 'varchar', length: 255, nullable: true })
  Email: string;

  @Column({ name: 'Lop', type: 'varchar', length: 50, nullable: true })
  Lop: string;

  @Column({
    name: 'Password',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  Password: string;

  @Column({
    name: 'Token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  Token: string;
}