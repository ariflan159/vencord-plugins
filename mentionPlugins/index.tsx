/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// import { Devs } from "@utils/constants";
import { addMessageAccessory, removeMessageAccessory } from "@api/MessageAccessories";
import { PluginCard } from "@components/settings/tabs/plugins/PluginCard";
import { ChangeList } from "@utils/ChangeList";
import definePlugin from "@utils/types";
import { useMemo } from "@webpack/common";


export default definePlugin({
    name: "MentionPlugins",
    description: "description",
    authors: [{ name: "ariflan", id: 581462944953663508n }],
    start() {
        addMessageAccessory("MentionPlugins", props => {
            const p = Vencord.Plugins.plugins[props.message.content];
            if (!p) return;
            const changes = useMemo(() => new ChangeList<string>(), []);
            return <div style={{ maxWidth: "400px", width: "100%", margin: 0 }}> <PluginCard
                onRestartNeeded={(name, key) => changes.handleChange(`${name}.${key}`)}
                disabled={false}
                plugin={p}
                isNew={false}
                key={p.name}
            /></div>;
        }, 4);
    },
    stop() {
        removeMessageAccessory("MentionPlugins");
    }
});
