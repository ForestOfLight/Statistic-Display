<!-- ![Understudy Logo](./understudy_logo_banner.png) -->

[![GitHub Downloads](https://img.shields.io/github/downloads/ForestOfLight/Statistic-Display/total?label=Github%20downloads&logo=github)](https://github.com/ForestOfLight/Statistic-Display/releases/latest)
[![Discord](https://badgen.net/discord/members/9KGche8fxm?icon=discord&label=Discord&list=what)](https://discord.gg/9KGche8fxm)
<!-- [![Curseforge Downloads](https://cf.way2muchnoise.eu/full_1093805_downloads.svg)](https://www.curseforge.com/minecraft-bedrock/addons/understudy) -->

# Statistic Display
This is an addon for Minecraft Bedrock Edition that easily displays statistics on the scoreboard.

Supported statistics:
- **Player Deaths**
- **Blocks Mined** (including each type of block)
- **Blocks Placed** (including each type of block)
- **Items Used** (including each type of item)
- **Entities Killed** (including each type of entity)
- **Killed By Entity** (including each type of entity)
- **Interacted with Block or Entity** (including each type of block and entity)
- **Highest Xp Level**

> [!IMPORTANT]
> This addon is a **Canopy Extension**, which means **Canopy** must be installed in your world for it to work.

**Canopy** can be downloaded here: https://github.com/ForestOfLight/Canopy

## Usage
All commands are prefixed with `./`. The `./stat` command is disabled until enabled with the `commandStat` rule. Do `./help` for more information.

**Usage: `./stat list`**  
Displays a list of all available statistics.

**Usage: `./stat <statistic>`**  
Displays the specified statistic on the scoreboard.

**Usage: `./stat <statistic/all> reset`**  
Resets the counts for the specified statistic, or all statistics.

**Usage: `./stat hide`**  
Hides the scoreboard.

**Usage: `./stat <statistic> print [player]`**  
Prints the top 15 players for the specified statistic, or for only the specified player.

**Usage: `./stat toggle [total/offline]`**  
Toggles displaying the total count of the statistic, or displaying offline players.

**Usage: `./transferstats`**  
A utility command used to transfer statistics from v1.0.0 of this addon to v1.1.0.
