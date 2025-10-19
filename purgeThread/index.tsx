/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, ApplicationCommandOptionType, sendBotMessage } from "@api/Commands";
import { getCurrentGuild } from "@utils/discord";
import { sleep } from "@utils/misc";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { GuildMemberStore } from "@webpack/common";
import { ThreadMemberListStore } from "plugins/memberCount";

const threadMemberActions = findByPropsLazy("removeMember", "leaveThread");

export default definePlugin({
    name: "PurgeThread",
    description: "Removes members with low amount of roles from the thread",
    authors: [{ name: "ariflan", id: 581462944953663508n }],
    commands: [
        {
            name: "purgethread",
            description: "um",
            inputType: ApplicationCommandInputType.BUILT_IN,
            options: [
                {
                    name: "role_amount",
                    description: "Minimal amount of roles to not be removed",
                    type: ApplicationCommandOptionType.INTEGER,
                    required: true
                },
                {
                    name: "ignore_roles",
                    description: "Roles that dont count towards the amount of roles, separated with space",
                    type: ApplicationCommandOptionType.STRING
                }
            ],
            execute: async (args, ctx) => {
                if (![11, 12, 15, 16].includes(ctx.channel.type)) {
                    sendBotMessage(ctx.channel.id, { content: "Command only works in threads" });
                    return;
                }
                const currentGuild = getCurrentGuild();
                if (!currentGuild) return;
                const threadMembers = ThreadMemberListStore.getMemberListSections(ctx.channel.id);
                const mergedUserIds = Object.values(threadMembers)
                    .flatMap(section => section.userIds || []);
                for (const user of mergedUserIds) {
                    const member = GuildMemberStore.getMember(currentGuild.id, user);
                    if (!member) continue;
                    const ignoredRoles = args[1].value.trim().split(/\s+/).filter(id => id);
                    const ignoredRolesExcluded = member.roles.filter(roleId => !ignoredRoles.includes(roleId));
                    if (ignoredRolesExcluded.length < args[0].value) {
                        threadMemberActions.removeMember(ctx.channel.id, member?.userId, "Context Menu");
                        await sleep(1000);
                    }
                }
            }
        }
    ]
});
