#!/usr/bin/env python3
import json
import os
from collections import defaultdict

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

    print(f"Graph loaded successfully: {len(nodes)} nodes, {len(links)} edges.")

    # 1. Multi-Nodes Analysis (Node Heterogeneity)
    node_by_id = {node["id"]: node for node in nodes}
    nodes_by_type = defaultdict(list)
    nodes_by_ext = defaultdict(list)

    for node in nodes:
        # Determine if it's a file node or symbol node
        is_file = node.get("source_location") == "L1" or node.get("label") == node.get("source_file")
        node_type = "File Node" if is_file else "Symbol Node"
        nodes_by_type[node_type].append(node)

        # Categorize by file extension
        src_file = node.get("source_file") or ""
        _, ext = os.path.splitext(src_file)
        ext = ext.lower() or "no_extension"
        nodes_by_ext[ext].append(node)

    # 2. Multi-Edges Analysis (Edge Heterogeneity)
    edges_by_relation = defaultdict(list)
    edges_by_confidence = defaultdict(list)
    
    for link in links:
        rel = link.get("relation", "unknown")
        conf = link.get("confidence", "unknown")
        edges_by_relation[rel].append(link)
        edges_by_confidence[conf].append(link)

    # 3. Multi-Communities Analysis (Leiden Clusters)
    community_nodes = defaultdict(list)
    for node in nodes:
        comm_id = node.get("community", -1)
        community_nodes[comm_id].append(node)

    # Cross-Community Edges (Bridges)
    cross_comm_edges = []
    intra_comm_edges = []
    bridge_node_scores = defaultdict(int) # Counts of cross-community connections per node

    for link in links:
        src_id = link["source"]
        tgt_id = link["target"]
        
        src_node = node_by_id.get(src_id)
        tgt_node = node_by_id.get(tgt_id)
        
        if not src_node or not tgt_node:
            continue
            
        src_comm = src_node.get("community", -1)
        tgt_comm = tgt_node.get("community", -1)
        
        if src_comm != tgt_comm and src_comm != -1 and tgt_comm != -1:
            cross_comm_edges.append(link)
            bridge_node_scores[src_id] += 1
            bridge_node_scores[tgt_id] += 1
        else:
            intra_comm_edges.append(link)

    # Community Connectivity Map
    comm_connections = defaultdict(int)
    for link in cross_comm_edges:
        s_node = node_by_id[link["source"]]
        t_node = node_by_id[link["target"]]
        c1 = s_node.get("community", -1)
        c2 = t_node.get("community", -1)
        if c1 < c2:
            comm_connections[(c1, c2)] += 1
        else:
            comm_connections[(c2, c1)] += 1

    # Sort communities by size
    sorted_communities = sorted(community_nodes.items(), key=lambda x: len(x[1]), reverse=True)
    
    # Sort bridge nodes by score
    sorted_bridges = sorted(bridge_node_scores.items(), key=lambda x: x[1], reverse=True)

    # Generate Report Content
    report_lines = []
    report_lines.append("# Graphify Connection & Topology Report")
    report_lines.append(f"This report presents an architectural analysis of the **Pixelmon** codebase. The graph was parsed and analyzed to uncover connections between multi-nodes, multi-edges, and multi-communities.")
    report_lines.append("")
    report_lines.append("## 1. Multi-Node (Entity) Distribution")
    report_lines.append("Nodes represent files, classes, functions, variables, or configuration parameters.")
    report_lines.append("")
    report_lines.append("| Node Category | Node Count | Percentage |")
    report_lines.append("|---|---|---|")
    for ntype, nlist in nodes_by_type.items():
        pct = (len(nlist) / len(nodes)) * 100
        report_lines.append(f"| {ntype} | {len(nlist)} | {pct:.1f}% |")
    report_lines.append("")
    report_lines.append("### Breakdown by Language / Extension")
    report_lines.append("| Extension | Node Count | Percentage |")
    report_lines.append("|---|---|---|")
    for ext, nlist in sorted(nodes_by_ext.items(), key=lambda x: len(x[1]), reverse=True):
        pct = (len(nlist) / len(nodes)) * 100
        report_lines.append(f"| `{ext}` | {len(nlist)} | {pct:.1f}% |")
    
    report_lines.append("")
    report_lines.append("## 2. Multi-Edge (Relationship) Analysis")
    report_lines.append("Edges represent relationships between nodes, including containment hierarchy, function calls, and imports.")
    report_lines.append("")
    report_lines.append("### Edges by Relation Type")
    report_lines.append("| Relation Type | Edge Count | Percentage | Description |")
    report_lines.append("|---|---|---|---|")
    
    relation_descs = {
        "contains": "Structural containment (e.g. file contains function/class)",
        "calls": "Functional invocation (e.g. function A calls function B)",
        "imports": "Dependency declaration (e.g. file A imports file B)",
        "inherits": "Object-oriented hierarchy (e.g. class A extends class B)",
        "references": "General reference or usage of a symbol",
    }
    
    for rel, elist in sorted(edges_by_relation.items(), key=lambda x: len(x[1]), reverse=True):
        pct = (len(elist) / len(links)) * 100
        desc = relation_descs.get(rel, "Semantic relationship or reference")
        report_lines.append(f"| `{rel}` | {len(elist)} | {pct:.1f}% | {desc} |")
        
    report_lines.append("")
    report_lines.append("### Edges by Extraction Confidence")
    report_lines.append("| Confidence | Edge Count | Description |")
    report_lines.append("|---|---|---|")
    for conf, elist in sorted(edges_by_confidence.items(), key=lambda x: len(x[1]), reverse=True):
        report_lines.append(f"| `{conf}` | {len(elist)} | Edges parsed with {conf.lower()} certainty |")

    report_lines.append("")
    report_lines.append("## 3. Multi-Community Topology (Leiden Clustering)")
    report_lines.append("Communities represent clustered modules/domains within the codebase detected using the Leiden algorithm.")
    report_lines.append("")
    report_lines.append(f"- **Total Discovered Communities:** {len(community_nodes)}")
    report_lines.append(f"- **Intra-Community Edges (Internal logic):** {len(intra_comm_edges)} ({len(intra_comm_edges)/len(links)*100:.1f}%)")
    report_lines.append(f"- **Cross-Community Edges (Bridges/Integrations):** {len(cross_comm_edges)} ({len(cross_comm_edges)/len(links)*100:.1f}%)")
    report_lines.append("")
    
    report_lines.append("### Top 15 Largest Communities")
    report_lines.append("| Community ID | Node Count | Primary Context (Files) |")
    report_lines.append("|---|---|---|")
    for comm_id, cnodes in sorted_communities[:15]:
        # Find primary source files for this community
        file_counts = defaultdict(int)
        for n in cnodes:
            file_counts[n.get("source_file", "unknown")] += 1
        top_files = sorted(file_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        top_files_str = ", ".join([f"`{f}` ({count})" for f, count in top_files])
        report_lines.append(f"| Community {comm_id} | {len(cnodes)} | {top_files_str} |")

    report_lines.append("")
    report_lines.append("### Top 15 Bridge Nodes (High Cross-Community Centrality)")
    report_lines.append("These symbols have the highest count of edges connecting different communities, representing critical codebase coupling points.")
    report_lines.append("")
    report_lines.append("| Node Label | Node ID | Source File | Cross-Comm Degree | Community |")
    report_lines.append("|---|---|---|---|---|")
    for nid, score in sorted_bridges[:15]:
        n = node_by_id[nid]
        report_lines.append(f"| **{n.get('label')}** | `{nid}` | `{n.get('source_file')}` | {score} | Comm {n.get('community')} |")

    report_lines.append("")
    report_lines.append("### Top Cross-Community Connections")
    report_lines.append("| Community A | Community B | Bridge Edge Count | Key Connecting Files |")
    report_lines.append("|---|---|---|---|")
    sorted_comm_conns = sorted(comm_connections.items(), key=lambda x: x[1], reverse=True)
    for (c1, c2), count in sorted_comm_conns[:15]:
        # Find some examples of edges
        examples = []
        for link in cross_comm_edges:
            s_n = node_by_id[link["source"]]
            t_n = node_by_id[link["target"]]
            sc = s_n.get("community")
            tc = t_n.get("community")
            if (sc == c1 and tc == c2) or (sc == c2 and tc == c1):
                examples.append(f"`{s_n.get('source_file')}` ↔ `{t_n.get('source_file')}`")
                if len(examples) >= 2:
                    break
        examples_str = " & ".join(examples)
        report_lines.append(f"| Community {c1} | Community {c2} | {count} | {examples_str} |")

    # Save Markdown report
    output_report_path = os.path.join("graphify-out", "CONNECTIONS_REPORT.md")
    with open(output_report_path, "w", encoding="utf-8") as rf:
        rf.write("\n".join(report_lines))

    print(f"\nAnalysis complete! Detailed markdown report generated at: {output_report_path}")
    print("\n" + "="*50)
    print("           SUMMARY OF GRAPH TOPOLOGY")
    print("="*50)
    print(f"Nodes count:       {len(nodes)}")
    print(f"Edges count:       {len(links)}")
    print(f"Communities count: {len(community_nodes)}")
    print(f"Intra-Comm Edges:  {len(intra_comm_edges)} ({len(intra_comm_edges)/len(links)*100:.1f}%)")
    print(f"Cross-Comm Edges:  {len(cross_comm_edges)} ({len(cross_comm_edges)/len(links)*100:.1f}%)")
    print("-"*50)
    print("Top 5 Bridge Nodes:")
    for nid, score in sorted_bridges[:5]:
        n = node_by_id[nid]
        print(f"  - {n.get('label')} ({n.get('source_file')}): {score} cross-comm edges")
    print("="*50)

if __name__ == "__main__":
    main()
