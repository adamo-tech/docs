import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from deploy import ORIGIN, deploy, validate_target


def config(domain=ORIGIN, alias="docs.adamohq.com", path=""):
    return {"Origins": {"Items": [{"DomainName": domain, "OriginPath": path}]},
            "Aliases": {"Items": [alias] if alias else []}}


class DeploymentTests(unittest.TestCase):
    def test_rejects_other_sites_and_prefixes(self):
        for target in (config(domain="other.s3.amazonaws.com"),
                       config(alias="operate.adamohq.com"), config(path="/other")):
            with self.subTest(target=target), self.assertRaises(ValueError):
                validate_target(target)
        validate_target(config())
        validate_target(config(alias=None))

    def test_incomplete_build_never_calls_aws(self):
        with tempfile.TemporaryDirectory() as directory, patch("deploy.aws") as aws:
            with self.assertRaises(ValueError):
                deploy(directory, "TEST")
            aws.assert_not_called()

    def test_uploads_dependencies_before_html_then_invalidates(self):
        with tempfile.TemporaryDirectory() as directory, patch("deploy.aws") as aws:
            root = Path(directory)
            for name in ("index.html", "404.html", "quickstart/index.html", "pagefind/pagefind.js"):
                file = root / name
                file.parent.mkdir(parents=True, exist_ok=True)
                file.touch()
            aws.side_effect = [json.dumps({"DistributionConfig": config()}), "", "", "",
                               json.dumps({"Invalidation": {"Id": "INVALIDATION"}}), ""]
            deploy(directory, "TEST")
            calls = [call.args for call in aws.call_args_list]
            self.assertIn("public,max-age=31536000,immutable", calls[1])
            self.assertIn("public,max-age=0,must-revalidate", calls[3])
            self.assertEqual(calls[4][:2], ("cloudfront", "create-invalidation"))
            self.assertEqual(calls[5][:3], ("cloudfront", "wait", "invalidation-completed"))
            self.assertFalse(any("--delete" in call for call in calls))
