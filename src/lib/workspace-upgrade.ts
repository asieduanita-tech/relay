import type {Workspace} from './types';
import {seed} from './seed';
import {performanceSeed} from './performance-seed';
import {validatePerformance} from './metrics';
export type LegacyWorkspace = Omit<Workspace,'schemaVersion'|'performance'> & {schemaVersion?:1};
export function upgradeWorkspace(record:Workspace|LegacyWorkspace):Workspace {
 if(record.schemaVersion===2){if(!record.demoContentVersion&&record.version===1){const updated=seed();return {...updated,createdAt:record.createdAt,version:record.version};}if([1,2,3].includes(record.performance.fixtureVersion as number))return {...record,performance:performanceSeed()};validatePerformance(record.performance);return record;}
 if(record.schemaVersion!==undefined&&record.schemaVersion!==1)throw new Error('Unsupported workspace schema version');
 // Additive: preserve revision, original sources, reviews, decisions and action state.
 return {...record,schemaVersion:2,performance:performanceSeed()};
}
