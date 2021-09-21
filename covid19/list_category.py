import category_train as ct


def print_topics(topics_dict_final):
    topics_list = list()
    topic_values = topics_dict_final.values()
    topic_values = list(topic_values)

    for i in range(len(topics_dict_final)):
        topics_list.append({'topic_id': i, 'words_probs': topic_values[i]})

    return topics_list


def main():
    tdf = ct.get_tdf()
    print(print_topics(tdf))


if __name__ == "__main__":
    main()

