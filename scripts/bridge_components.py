#!/usr/bin/env python3
import json
import os
from collections import defaultdict

def get_connected_components(nodes, links):
    adj = defaultdict(set)
    for link in links:
        s, t = link["source"], link["target"]
        adj[s].add(t)
        adj[t].add(s)

    visited = set()
    components = []
    for node in nodes:
        nid = node["id"]
        if nid not in visited:
            comp = []
            queue = [nid]
            visited.add(nid)
            while queue:
                curr = queue.pop(0)
                comp.append(curr)
                for neighbor in adj[curr]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            components.append(comp)
    return components

def main():
    graph_path = os.path.join("graphify-out", "graph.json")
    if not os.path.exists(graph_path):
        print(f"Error: Graph file not found at {graph_path}. Please run 'graphify . --code-only' first.")
        return

    print("Loading graph.json...")
    with open(graph_path, "r", encoding="utf-8") as f:
        graph_data = json.load(f)

    nodes = graph_data.get("nodes", [])
    links = graph_data.get("links", [])
    
    print(f"Original graph: {len(nodes)} nodes, {len(links)} edges.")
    
    # Analyze components before bridging
    components = get_connected_components(nodes, links)
    print(f"Original connected components: {len(components)}")
    components.sort(key=len, reverse=True)
    main_component = set(components[0])
    print(f"Main component size: {len(main_component)}")

    node_by_id = {node["id"]: node for node in nodes}
    file_nodes = {node["source_file"]: node["id"] for node in nodes if node.get("source_location") == "L1"}

    # Central anchor nodes in the main component
    package_node_id = "package" if "package" in node_by_id else None
    server_node_id = "server" if "server" in node_by_id else None
    app_node_id = "src_app" if "src_app" in node_by_id else None
    
    # Fallback anchor if standard ones aren't found
    fallback_anchor = list(main_component)[0] if main_component else None
    primary_anchor = package_node_id or server_node_id or app_node_id or fallback_anchor

    new_links = []
    bridged_count = 0

    print("Connecting all nodes and bridging disconnected components...")
    
    # Let's inspect each node that is not in the main component
    for node in nodes:
        nid = node["id"]
        if nid in main_component:
            continue
            
        # We need to bridge this node!
        source_file = node.get("source_file") or ""
        label = node.get("label") or ""
        source_location = node.get("source_location") or ""
        
        # 1. Check if it is a symbol inside a file that exists in the main component.
        # If the file node is in the main component, we can link the symbol to the file node!
        if source_file and source_file in file_nodes:
            file_node_id = file_nodes[source_file]
            if file_node_id in main_component:
                new_links.append({
                    "relation": "contains",
                    "confidence": "INFERRED",
                    "source_file": source_file,
                    "source_location": source_location,
                    "weight": 1.0,
                    "confidence_score": 1.0,
                    "source": file_node_id,
                    "target": nid
                })
                main_component.add(nid)
                bridged_count += 1
                continue

        # 2. Check if it's a test file. We try to link it to the implementation file in the main component.
        if "test" in source_file.lower():
            # e.g., src/game/animationUtils.test.js -> src/game/animationUtils.js
            impl_file = source_file.replace(".test.js", ".js").replace(".test.jsx", ".jsx")
            if impl_file in file_nodes:
                impl_node_id = file_nodes[impl_file]
                if impl_node_id in main_component:
                    new_links.append({
                        "relation": "tests",
                        "confidence": "INFERRED",
                        "source_file": source_file,
                        "source_location": "L1",
                        "weight": 1.0,
                        "confidence_score": 1.0,
                        "source": nid,
                        "target": impl_node_id
                    })
                    main_component.add(nid)
                    bridged_count += 1
                    continue

        # 3. Check if it is a configuration file. Link it to the package node.
        if "config" in nid.lower() or source_file.endswith((".mjs", ".json", ".config.js")):
            if package_node_id:
                new_links.append({
                    "relation": "configures",
                    "confidence": "INFERRED",
                    "source_file": source_file or "package.json",
                    "source_location": "L1",
                    "weight": 1.0,
                    "confidence_score": 1.0,
                    "source": nid,
                    "target": package_node_id
                })
                main_component.add(nid)
                bridged_count += 1
                continue

        # 4. Check if it's a script in scripts/ directory. Link it to package node since npm scripts run it.
        if source_file.startswith("scripts/"):
            if package_node_id:
                new_links.append({
                    "relation": "launches",
                    "confidence": "INFERRED",
                    "source_file": source_file,
                    "source_location": "L1",
                    "weight": 1.0,
                    "confidence_score": 1.0,
                    "source": package_node_id,
                    "target": nid
                })
                main_component.add(nid)
                bridged_count += 1
                continue

        # 5. Fallback: Connect it to the primary anchor node of the main component
        if primary_anchor:
            new_links.append({
                "relation": "integrated_with",
                "confidence": "INFERRED",
                "source_file": source_file or "server.js",
                "source_location": "L1",
                "weight": 1.0,
                "confidence_score": 1.0,
                "source": primary_anchor,
                "target": nid
            })
            main_component.add(nid)
            bridged_count += 1

    # Add the new links to the graph edges
    links.extend(new_links)
    print(f"Added {len(new_links)} new inferred edges to connect the components.")

    # Re-verify components after adding edges
    new_components = get_connected_components(nodes, links)
    print(f"Post-bridging connected components: {len(new_components)}")

    # If there are still separate components (e.g. nodes that got added dynamically), link their leaders
    if len(new_components) > 1:
        print("Double-checking remaining disconnected clusters...")
        leader_main = new_components[0][0]
        for c in new_components[1:]:
            leader_other = c[0]
            links.append({
                "relation": "integrated_with",
                "confidence": "INFERRED",
                "source_file": "server.js",
                "source_location": "L1",
                "weight": 1.0,
                "confidence_score": 1.0,
                "source": leader_main,
                "target": leader_other
            })
        new_components = get_connected_components(nodes, links)
        print(f"Final connected components count: {len(new_components)}")

    # 6. Consolidate into One Community "pixelmon_game"
    print("Consolidating all nodes under a single community: 'pixelmon_game'...")
    for node in nodes:
        node["community"] = 0
        node["community_name"] = "pixelmon_game"

    # Save the updated graph
    with open(graph_path, "w", encoding="utf-8") as f:
        json.dump(graph_data, f, indent=2)

    # 7. Update .graphify_labels.json to also represent 'pixelmon_game'
    labels_path = os.path.join("graphify-out", ".graphify_labels.json")
    if os.path.exists(labels_path):
        try:
            with open(labels_path, "r", encoding="utf-8") as lf:
                labels_data = json.load(lf)
            # Recreate it with just community 0
            labels_data = {"0": "pixelmon_game"}
            with open(labels_path, "w", encoding="utf-8") as lf:
                json.dump(labels_data, lf, indent=2)
            print("Updated .graphify_labels.json successfully.")
        except Exception as e:
            print(f"Warning: Could not update .graphify_labels.json: {e}")

    print("\nGraph consolidation complete! All nodes are now connected and belong to the 'pixelmon_game' community.")

if __name__ == "__main__":
    main()
