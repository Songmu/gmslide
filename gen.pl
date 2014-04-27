#!/usr/bin/env perl
use 5.014;
use warnings;
use utf8;
use autodie;

use Path::Tiny;
use Text::Markdown::Slidy;
use Text::Markdown::Discount;
use Text::Xslate;
use YAML::Tiny;

my $file = path('index.md');
my ($header_raw, $body) = split /^---\n/ms, $file->slurp_utf8, 2;
my $headers = YAML::Tiny::Load($header_raw);

state $md = Text::Markdown::Slidy->new(
    md => Text::Markdown::Discount->new,
);
my $slides = $md->markdown($body);
state $tx = Text::Xslate->new;
my $html = $tx->render('index.tx' => {
    %$headers,
    slides => $slides,
});

path('index.html')->spew_utf8($html);
