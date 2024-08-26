import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventTrackerTypes } from "../enums/event-tracker-types.enum";
import { EventTrackerSubjectTypes } from "../enums/event-tracker-subject-types.enum";


@ObjectType()
@Entity("base_event_tracker")
export class EventTracker extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => EventTrackerTypes)
  @Column("enum", { enum: EventTrackerTypes })
  type: EventTrackerTypes;

  @Field()
  @Column("inet")
  ipAddress: string;

  @Field()
  @Column()
  agent: string;

  @Field(() => EventTrackerSubjectTypes)
  @Column("enum", { enum: EventTrackerSubjectTypes })
  subjectType: EventTrackerSubjectTypes;

  @Field(() => Int)
  @Column()
  subjectId: number;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  url: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
