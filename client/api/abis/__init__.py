import json
import pathlib


def load_json_as_module(file: pathlib.Path):
    if not file.is_file() and not file.name.endswith(".json"):
        raise FileNotFoundError(f"The path {file} is not a json file.")

    with open(file, "r") as file:
        return json.load(file)


directory = pathlib.Path(__file__).parent

hotel = load_json_as_module(directory / "hotel.json")
organisation = load_json_as_module(directory / "organization.json")
organisation_factory = load_json_as_module(directory / "organization_factory.json")
