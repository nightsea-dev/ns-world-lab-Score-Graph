import { HasScore } from "../../capabilities/index.js";
import { Relationship } from "../../contracts/index.js";

export type StringRelationshipWithScore =
    & Relationship<string>
    & HasScore
