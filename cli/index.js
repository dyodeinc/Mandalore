import { Command } from 'commander';
const program = new Command();

// IMPORTANT: Since this cli is run under a sub command defined in the package.json, when invoking commands options MUST be passed after a `--` delimiter.

// Example
// npm run osb string-manipulation split My:String -- -s :

// Generalized example
// npm run osb <COMMAND> <SUBCOMMANDS> <ARGUMENTS> -- -option1 1 -option2 2 -option3 3

// WILL NOT WORK
// npm run osb string-manipulation split My:String -s :

import stringManipulationCommand from './commands/example/string-manipulation.js'

import logCommand from './log.js';
import initCommand from './init.js';

program
  .name('osb')
  .usage("[global options] command")
  .description('Command line tool to help bootstrap OSB projects')
  .version('0.1.0');

program.addCommand(logCommand)
program.addCommand(initCommand)

program.addCommand(stringManipulationCommand) // This is a command with subcommands ie `npm run osb myCommand mySubCommand`
program.configureHelp()

program.parse()