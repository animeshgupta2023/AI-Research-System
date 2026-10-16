from .agents import build_reader_agent, build_search_agent, writer_chain, critic_chain

def content_to_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict) and isinstance(block.get("text"), str):
                parts.append(block["text"])
        return "\n".join(parts)
    return str(content)

def run_research_pipeline(topic: str)-> dict:
    state = {}

    # search agent working
    print("\n" + "="*100)
    print("step 1 - search agent working ...")
    print("\n" + "="*100)

    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]
    })

    state["search_results"] = content_to_text(search_result["messages"][-1].content)

    print("\n search result ", state['search_results'])


    # step 2 
    print("\n" + "="*100)
    print("step 2 - reader agent is scraping top resources ...")
    print("\n" + "="*100)

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [(
            "user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]
    })

    state['scraped_content'] = content_to_text(reader_result["messages"][-1].content)

    print("\nscraped content\n", state['scraped_content'])

    # step 3 - writer chain

    print("\n" + "="*100)
    print("step 3 - writer is drafting a report ...")
    print("\n" + "="*100)

    research_combined = (
        f"SEARCH RESULTS: \n {state['search_results']}\n\n" 
        f"DETAILED SCRAPED CONTENT: \n {state['scraped_content']}"            
    )

    state["report"] = writer_chain.invoke({
        "topic" : topic,
        "research": research_combined
    })

    print("\n Final report \n", state['report'])

    # critic prompt
    print("\n" + "="*100)
    print("step 4 - critic is reviewing report ...")
    print("\n" + "="*100)

    state["feedback"] = critic_chain.invoke({
        "report": state["report"]
    })

    print("\n critic report \n", state["feedback"])

    return state


if __name__ == "__main__":
    topic = input("\n Enter a research topic: ")
    run_research_pipeline(topic=topic)